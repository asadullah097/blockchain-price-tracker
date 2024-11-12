import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class CmcService {
  private readonly apiUrl = process.env.TOKEN_METRICE_SYMBOL_URL;
  private readonly headers = {
    "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
  };

  async getNatvieTokenPrice(name: string) {
    try {
      const price = await axios.get(`${this.apiUrl}${name}`, {
        headers: this.headers,
      });

      if (price.data) {
        const data = price?.data?.data[name];
        return data;
      }
    } catch (error) {
      return 0;
    }
  }
}
