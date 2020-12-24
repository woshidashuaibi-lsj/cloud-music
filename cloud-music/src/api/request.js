import { axiosInstance } from "./config";

export const getBannerRequest = () => {
    return axiosInstance.get ('/banner');
}

export const getRecommendListRequest = () => {
    return axiosInstance.get ('/personalized');
}

export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
}

export const getSingerListRequest= (types,areas,alpha,count,) => {
  return axiosInstance.get(`/artist/list?type=${types}&area=${areas}&initial=${alpha.toLowerCase()}&offset=${count}`);
}