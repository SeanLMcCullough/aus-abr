import axios from "axios";
import cheerio from "cheerio";
import { readTable, readTableWithHeader, getFieldName } from "./helper";
import { TableNames } from "./enum";

async function fetch(url) {
  const resposne = await axios.get(url);
  const $ = cheerio.load(resposne.data);
  const tables = $("table").toArray();
  const parseTable = tables.reduce((current, table) => {
    const caption = $("caption", table).text().trim();
    current[caption.replace(" help", "")] = table;
    return current;
  }, {});

  return { $, tables, parseTable };
}
export async function lookupABN(abn: string) {
  const stripped = abn.replace(/\s/gi, "");
  const url = `https://abr.business.gov.au/ABN/View?id=${stripped}`;
  // https://connectonline.asic.gov.au/RegistrySearch/faces/landing/panelSearch.jspx?searchText=006912563&searchType=OrgAndBusNm&_adf.ctrl-state=10fzl38u1j_40
  const { $, parseTable } = await fetch(url);

  return {
    details: readTable($, parseTable[TableNames.ABN_DETAILS]),
    tradingNames: readTableWithHeader(
      $,
      parseTable[TableNames.TRADING_NAME],
      1
    ),
    businessNames: readTableWithHeader($, parseTable[TableNames.BUSINESS_NAME]),
  };
}

export async function getHistory(abn: string) {
  const stripped = abn.replace(/\s/gi, "");
  const url = `https://abr.business.gov.au/AbnHistory/View?id=${stripped}`;

  const { tables, $ } = await fetch(url);

  const result: any = {};
  const trs = $("tr").toArray();
  let keyName = "";
  trs.forEach((tr) => {
    const th = $("th", tr).toArray();
    if (th.length > 0) {
      keyName = getFieldName($(th[0]).text().trim()).key;
      result[keyName] = result[keyName] || [];
    }
    const td = $("td", tr).toArray();
    if (td.length > 0) {
      result[keyName].push({
        value: $(td[0]).text().trim(),
        from: $(td[1]).text().trim(),
        to: $(td[2]).text().trim(),
      });
    }
  });
  return result;
}

export async function searchActive(keyword: string) {
  const url = `https://abr.business.gov.au/Search/ResultsActive?SearchText=${decodeURIComponent(
    keyword
  )}`;
  const { $, parseTable } = await fetch(url);

  return readTableWithHeader($, parseTable["Matching names"]);
}
