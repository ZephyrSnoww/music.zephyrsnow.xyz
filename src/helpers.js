import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { state } from './state.js';

const parser = new XMLParser({ ignoreAttributes: false });

export async function navidromeRequest (path, params) {
  return new Promise((resolve, reject) => {
    axios.get(`http://mc.zephyrsnow.xyz:4533/rest/${path}`, {
      params: {
        u: state.loginInfo.username,
        p: state.loginInfo.password,
        v: '1.16.1',
        c: 'music.zephyrsnow.xyz',
        ...params
      }
    }).then((resp) => {
      resolve(parser.parse(resp.data)['subsonic-response']);
    });
  })
}

export function toTime (duration) {
  duration = Math.floor(duration);

  let seconds = duration % 60;
  let minutes = (duration - seconds) / 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}
