import JSZip from "jszip";
import {
  AtlasAttachmentLoader,
  SkeletonBinary,
  SkeletonJson,
  Spine,
  SpineTexture,
  TextureAtlas,
} from "@esotericsoftware/spine-pixi-v8";
import { Texture } from "pixi.js";

type LoadedSpineZip = {
  spine: Spine;
  destroy: () => void;
};

function normalizeZipPath(value: string) {
  return value.replace(/^\/+/, "").replace(/\\/g, "/");
}

function getBaseName(value: string) {
  const normalized = normalizeZipPath(value);
  const parts = normalized.split("/");
  return parts[parts.length - 1];
}

function findZipEntry(zip: JSZip, predicate: (path: string) => boolean) {
  return Object.values(zip.files).find((entry) => !entry.dir && predicate(entry.name));
}

function findTextureEntry(zip: JSZip, pageName: string) {
  const normalizedPageName = normalizeZipPath(pageName);
  const pageBaseName = getBaseName(pageName);

  return findZipEntry(zip, (filePath) => {
    const normalizedFilePath = normalizeZipPath(filePath);
    return normalizedFilePath === normalizedPageName || getBaseName(normalizedFilePath) === pageBaseName;
  });
}

export async function loadSpineFromZip(zipUrl: string, scale = 1): Promise<LoadedSpineZip> {
  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch spine zip: ${response.status} ${response.statusText}`);
  }

  const zip = await JSZip.loadAsync(await response.arrayBuffer());
  const atlasEntry = findZipEntry(zip, (filePath) => filePath.endsWith(".atlas"));
  const jsonEntry = findZipEntry(zip, (filePath) => filePath.endsWith(".json"));
  const skelEntry = findZipEntry(zip, (filePath) => filePath.endsWith(".skel"));
  const skeletonEntry = jsonEntry ?? skelEntry;

  if (!atlasEntry || !skeletonEntry) {
    throw new Error("Spine zip is missing atlas or skeleton file");
  }

  const atlas = new TextureAtlas(await atlasEntry.async("string"));
  const textures: Texture[] = [];

  for (const page of atlas.pages) {
    const textureEntry = findTextureEntry(zip, page.name);
    if (!textureEntry) {
      throw new Error(`Spine zip is missing texture page: ${page.name}`);
    }

    const textureBlob = await textureEntry.async("blob");
    const imageBitmap = await createImageBitmap(textureBlob);
    const texture = Texture.from(imageBitmap);
    textures.push(texture);
    page.setTexture(SpineTexture.from(texture.source));
  }

  const attachmentLoader = new AtlasAttachmentLoader(atlas);
  let skeletonData;

  if (jsonEntry) {
    const reader = new SkeletonJson(attachmentLoader);
    reader.scale = scale;
    skeletonData = reader.readSkeletonData(JSON.parse(await jsonEntry.async("string")));
  } else {
    const reader = new SkeletonBinary(attachmentLoader);
    reader.scale = scale;
    skeletonData = reader.readSkeletonData(await skeletonEntry.async("uint8array"));
  }

  const spine = new Spine(skeletonData);

  return {
    spine,
    destroy: () => {
      spine.destroy({ children: true });
      textures.forEach((texture) => texture.destroy(true));
      atlas.dispose();
    },
  };
}
