import { HTTPData } from "../../framework/data_http.js";

export function groupingControllerWithTag(httpData: HTTPData[]): { tag: string; httpDatas: HTTPData[] }[] {
  const groupedData: { [tag: string]: HTTPData[] } = {};
  httpData.forEach((item) => {
    if (groupedData[item.tag]) {
      groupedData[item.tag].push(item);
    } else {
      groupedData[item.tag] = [item];
    }
  });
  const result: { tag: string; httpDatas: HTTPData[] }[] = [];
  for (const tag in groupedData) {
    result.push({ tag, httpDatas: groupedData[tag] });
  }
  return result;
}
