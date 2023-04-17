import { CubeCube, CubeDimension, CubeQuery } from './cube';
import { DbtMetric, DbtQuery, DbtQueryWithSQL } from './dbt';
import { LightdashDbtMetric, LightdashQuery } from './lightdash';
import { LookerField, LookerQuery } from './looker';
import { MetabaseField, MetabaseQuery } from './metabase';

export type DataServiceType =
  | 'mock'
  | 'dbt_cloud'
  | 'lightdash'
  | 'looker'
  | 'metabase'
  | 'cubejs';

export type Catalog =
  | LightdashField[]
  | DbtMetric[]
  | LightdashDbtMetric[]
  | MetabaseField[]
  | CubeDimension[]
  | LookerField[];

export type CatalogItem = Catalog[0];

export type LightdashField = {
  name: string;
  label?: string;
  description?: string;
  explore: string;
  table: string;
};

export type QueryResult = Record<
  string,
  string | number | Date | boolean | JSON
>[];

export type Conversation = {
  text: string;
  author: 'delphi' | 'user';
};

type QueryRequest = {
  question: string;
  conversation?: Conversation[];
  includeSummary?: boolean;
};

export interface DbtMetricsQueryRequest extends QueryRequest {
  jobId?: string;
  serviceToken?: string;
  metrics?: Record<string, string | string[]>[];
}

export interface LightdashQueryRequest extends QueryRequest {
  dimensions: LightdashField[];
  metrics: LightdashField[];
}

export interface LookerQueryRequest extends QueryRequest {
  dimensions: LookerField[];
  metrics: LookerField[];
}

export interface GetAnswerRequest {
  question: string;
  data: QueryResult;
  conversation?: Conversation[];
  query?: string | LightdashQuery;
}

export type Query =
  | LightdashQuery
  | DbtQueryWithSQL
  | MetabaseQuery
  | CubeQuery
  | LookerQuery;

export type QueryResponse<T extends Query> = {
  query: T;
  summary?: string;
};

export type LightdashQueryResponse = QueryResponse<LightdashQuery>;
export type DbtMetricsQueryResponse = QueryResponse<DbtQueryWithSQL>;
export type LookerQueryResponse = QueryResponse<LookerQuery>;

export interface MetabaseQueryRequest extends QueryRequest {
  dimensions: MetabaseField[];
  metrics: MetabaseField[];
}
export type MetabaseQueryResponse = QueryResponse<MetabaseQuery>;

export interface CubeQueryRequest extends QueryRequest {
  cubes: CubeCube[];
}
export type CubeQueryResponse = QueryResponse<CubeQuery>;

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
    | LookerField[];
  cubes?: CubeCube[];
  includeSummary?: boolean;
  type?: DataServiceType;
  conversation?: Conversation[];
}

export interface RefineQueryResponse<T extends Query> {
  query: T extends DbtQuery
    ? DbtMetricsQueryResponse
    : T extends LightdashQuery
    ? LightdashQuery
    : T extends CubeQuery
    ? CubeQuery
    : MetabaseQuery;
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
  type: DataServiceType;
  includeSummary?: boolean;
  limit?: number;
  minSimilarity?: number;
};

export type GetValidatedQueryResponse = {
  query: Query;
  validatedAt: string | undefined;
  question: string;
  summary?: string;
  validatedBy?: string;
};

export type PostValidatedQueryRequest = GetValidatedQueryRequest & {
  query: Query;
  validatedBy?: string;
};

export type ErrorResponse = {
  error: string;
};
