import http from '../http';
const baseURL = import.meta.env.VITE_APP_NG_URL;
 
/**getPreviewExercise 预览接口 */
export async function getPreviewExerciseData(businessContentUuid:string): Promise<any> {
  const res = await http<any>({
    baseURL,
    url: `/ace-kellis/api/v2/preview/courseware_next/${businessContentUuid}`
  });
  return res.data
}