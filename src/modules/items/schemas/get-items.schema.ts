import { RouteShorthandOptions } from "fastify";
import { CurrencyEnum } from "../types/currency.enum";
import { AppId } from "../types/types";

export interface IItemsQuery {
	app_id: AppId; 
	currency: CurrencyEnum
}

// ------------------------------------------------------------------------

const getItemsQueryStringSchema = {
	type: "object",
	properties: {
		app_id: { type: "string" },
		currency: { type: "string" },
	},
};

export const GetManyItemsSchema: RouteShorthandOptions = {
	schema: {
		querystring: getItemsQueryStringSchema,
	},
};
