import { AtScaleCube, AtScaleQuery } from './atscale';
import { CubeCube, CubeDimension, CubeQuery } from './cube';
import { DbtMetric, DbtQuery } from './dbt';
import { GA4Field, GA4Query } from './ga4';
import {
  LightdashDbtMetric,
  LightdashField,
  LightdashQuery,
} from './lightdash';
import { LookerField, LookerQuery } from './looker';
import { MetabaseField, MetabaseQuery } from './metabase';
import { PropelMetric, PropelQuery } from './propel';

export type DelphiApiResponse<T extends unknown> =
  | {
      status: 'ok';
      result: T;
    }
  | {
      status: 'error';
      error: string;
    };

export type ConnectionType =
  | 'atScale'
  | 'cube'
  | 'dbtCloud'
  | 'ga4'
  | 'lightdash'
  | 'looker'
  | 'metabase'
  | 'propel';

export type ConnectionPrettyType =
  | 'Mock'
  | 'dbt Cloud'
  | 'Google Analytics'
  | 'Lightdash'
  | 'Looker'
  | 'Metabase'
  | 'Cube'
  | 'AtScale'
  | 'Propel';

export type Catalog =
  | LightdashField[]
  | DbtMetric[]
  | LightdashDbtMetric[]
  | MetabaseField[]
  | CubeDimension[]
  | LookerField[]
  | GA4Field[];

export type CatalogItem = Catalog[0];

export type BIEntityType = 'saved_query' | 'dashboard';

export type BIEntity = {
  type: BIEntityType;
  name: string;
  description?: string;
  id: string;
  url: string;
  author?: string;
  imageUrl: string;
  updatedAt?: string;
  views?: number;
};

export type QueryResult = Record<
  string,
  string | number | Date | boolean | JSON
>[];

export type Conversation = {
  text: string;
  author: 'delphi' | 'user' | 'function';
};

export type QueryRequest = {
  question: string;
  table?: string;
  fields: string[];
  conversation?: Conversation[];
  includeSummary?: boolean;
  notes?: string[];
};

export type CubeQueryRequest = QueryRequest & {
  cubes?: CubeCube[];
};

export interface GetAnswerRequest {
  question: string;
  data: QueryResult;
  conversation?: Conversation[];
  query?: Query | string;
  currency?: string;
  notes?: string[];
}

export type Query =
  | LightdashQuery
  | DbtQuery
  | MetabaseQuery
  | CubeQuery
  | LookerQuery
  | AtScaleQuery
  | PropelQuery;

export type QueryResponse<T extends Query> = {
  query:
    | (T & { status?: 'ok' })
    | { status: 'clarification_needed'; message: string };
  summary?: string;
};

export type LightdashQueryResponse = QueryResponse<LightdashQuery>;
export type DbtMetricsQueryResponse = QueryResponse<DbtQuery>;
export type LookerQueryResponse = QueryResponse<LookerQuery>;
export type AtScaleQueryResponse = QueryResponse<AtScaleQuery>;
export type PropelQueryResponse = QueryResponse<PropelQuery>;

export interface MetabaseQueryRequest extends QueryRequest {
  dimensions: MetabaseField[];
  metrics: MetabaseField[];
}
export type MetabaseQueryResponse = QueryResponse<MetabaseQuery>;

export type CubeQueryResponse = QueryResponse<CubeQuery>;

export type GA4QueryResponse = QueryResponse<GA4Query>;

export interface RefineQueryRequest<T extends Query> {
  query: T;
  message: string;
  originalQuestion: string;
  dimensions?: LightdashField[] | MetabaseField[] | LookerField[] | [];
  metrics?:
    | LightdashField[]
    | DbtMetric[]
    | LightdashDbtMetric[]
    | MetabaseField[]
    | LookerField[]
    | PropelMetric[];
  cubes?: AtScaleCube[] | CubeCube[];
  includeSummary?: boolean;
  type?: ConnectionType;
  conversation?: Conversation[];
  notes?: string[];
}

export interface SummarizeQueryRequest {
  query: Query;
  question?: string;
}

export interface SummarizeQueryResponse {
  summary: string;
}

export interface GetAnswerResponse {
  answer: string;
}

export interface GetChartResponse {
  chart: string;
  url: string;
}

export type Document = {
  name: string;
};

export type SearchEntitiesRequest<T extends Document> = {
  question: string;
  entities: T[];
};

export type SearchEntitiesResponse<T extends Document> = {
  relevantEntities: T[];
};

export type GetValidatedQueryRequest = {
  question: string;
  type: ConnectionType;
  includeSummary?: boolean;
  limit?: number;
  minSimilarity?: number;
};

export type GetValidatedQueryResponse = {
  query: Query;
  validatedAt: string | undefined;
  question: string;
  summary?: string;
  askedBy?: string;
  validatedBy?: string;
};

export type PostValidatedQueryRequest = GetValidatedQueryRequest & {
  query: Query;
  validatedBy?: string;
  askedBy?: string;
};

export type MessageClassification =
  | 'general_question'
  | 'edit_previous_query'
  | 'data_pull'
  | 'metric_query'
  | 'data_query'
  | 'question_about_catalog'
  | 'chart_or_graph';

export type ClassifyMessageRequest = {
  message: string;
};

export type ClassifyMessageResponse = {
  classification: MessageClassification;
};

export type ChatRequest = {
  message: string;
  conversation?: Conversation[];
  semanticLayerType?: ConnectionType;
  catalog?: {
    dimensions: Catalog;
    metrics: Catalog;
    cubes?: CubeCube[] | AtScaleCube[];
  };
  fields?: string[];
};

export type ChatResponse = {
  text: string;
};

export type SavedDimension = {
  name: string;
  values: string[];
};

export type ProfileDimensionsRequest = {
  dimensions: SavedDimension[];
  connectionType: ConnectionType;
};

export type ErrorResponse = {
  message: string;
};

export type LanguageModel =
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'azure-gpt-4'
  | 'claude-v1'
  | 'palm-2'
  | 'delphi'
  | 'gpt-3.5-turbo'
  | 'mistral'
  | 'delphi-coordinator'
  | 'delphi-query';

export type TextToCrontabRequest = {
  text: string;
};

export type TextToCrontabResponse = {
  crontab: string;
};

export type AuthenticateRequest = {
  clientId: string;
  apiKey: string;
};

export enum COORDINATOR_FUNCTIONS {
  PLAN = 'registerPlan',
  SEARCH_DASHBOARDS = 'searchDashboards',
  SEARCH_CATALOG = 'searchCatalog',
  SEARCH_VALUES = 'searchValues',
  GET_DATA = 'getData',
  EDIT_QUERY = 'editQuery',
  SQL_QUERY = 'runSqlQuery',
  ANSWER_QUESTION = 'answerQuestion',
  DISPLAY_CHART = 'displayChart',
  MESSAGE_USER = 'messageUser',
}

export type CoordinatorRequest = {
  message: string;
  conversation?: Conversation[];
  catalog?: {
    dimensions: Catalog;
    metrics: Catalog;
    cubes?: CubeCube[] | AtScaleCube[];
  };
  connectionType: ConnectionType;
  currency?: string;
  notes?: string[];
  colors?: {
    primary?: string;
    secondary?: string;
  };
};

export type CoordinatorResponse = {
  type:
    | 'plan'
    | 'searchDashboards'
    | 'catalog'
    | 'values'
    | 'query'
    | 'edit'
    | 'answer'
    | 'chart'
    | 'message'
    | 'sql'
    | 'error';
  response: string;
  catalog?: {
    dimensions: Catalog;
    metrics: Catalog;
    cubes?: CubeCube[] | AtScaleCube[];
  };
  question?: string;
  query?: Query;
  table?: string;
  fields?: string[];
  values?: string[];
  filters?: string[];
  plan?: string;
  answer?: string;
  chart?: {
    dataName: string;
    type: 'area' | 'bar' | 'bar_list' | 'donut' | 'line' | 'table';
    measures: string[];
    dimension?: string;
    pivot?: string;
    stacked?: boolean;
  };
  sql?: string;
  name?: string;
  conversation: Conversation[];
};
