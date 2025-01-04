// src/modules/cms/store/services/cmsApi.ts

import { api as baseApi, ApiType } from '@store/api';
// Import your types or define them here
// e.g., Content, ContentDto, etc.

export interface ContentDto {
  contentType: string;
  title: string;
  slug: string;
  body: string;
  tags: string[];
  status: string;
  language: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

export interface Content extends ContentDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  versions: Version[];
}

export interface Version {
  versionNumber: number;
  title: string;
  body: string;
  modifiedAt: string;
  modifiedBy: string;
}

// Keep track of whether we’ve injected endpoints before
let endpointsInjected = false;

/**
 * The extended “slice” returned by `api.injectEndpoints(...)`.
 * We'll store it in a variable after injection.
 */
let extendedApi: ApiType | null = null;
/**
 * Dynamically inject CMS endpoints into the baseApi.
 * Only called once to avoid duplicate injection errors.
 */
export function addCmsEndpoints() {
  if (!endpointsInjected) {
    endpointsInjected = true;

    extendedApi = baseApi.injectEndpoints({
      endpoints: (builder) => ({
        getContentById: builder.query<Content, string>({
          query: (id) => `cms/${id}`,
          providesTags: ['Contents'],
        }),

        getAllContents: builder.query<Content[], void>({
          query: () => 'cms',
          providesTags: ['Contents'],
        }),

        createContent: builder.mutation<Content, ContentDto>({
          query: (content) => ({
            url: 'cms',
            method: 'POST',
            body: content,
          }),
          invalidatesTags: ['Contents'],
        }),

        updateContent: builder.mutation<void, { id: string; content: ContentDto }>({
          query: ({ id, content }) => ({
            url: `cms/${id}`,
            method: 'PUT',
            body: content,
          }),
          invalidatesTags: ['Contents'],
        }),

        deleteContent: builder.mutation<void, string>({
          query: (id) => ({
            url: `cms/${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: ['Contents'],
        }),

        restoreContentVersion: builder.mutation<void, { id: string; versionNumber: number }>({
          query: ({ id, versionNumber }) => ({
            url: `cms/${id}/restore/${versionNumber}`,
            method: 'POST',
          }),
          invalidatesTags: ['Contents'],
        }),
      }),
      overrideExisting: false, // ensure we don't overwrite existing endpoints
    });
  }

  return extendedApi;
}

/**
 * A helper to retrieve typed hooks after injection.
 * If `addCmsEndpoints()` hasn't been called, this will throw an error.
 */
export function getCmsHooks() {
  if (!extendedApi) {
    throw new Error(
      'CMS endpoints have not been injected yet. ' + 
      'Make sure to call addCmsEndpoints() before using getCmsHooks()'
    );
  }
  // Return whichever hooks you want to consume in components
  return {
    useGetContentByIdQuery: extendedApi.useGetContentByIdQuery,
    useGetAllContentsQuery: extendedApi.useGetAllContentsQuery,
    useCreateContentMutation: extendedApi.useCreateContentMutation,
    useUpdateContentMutation: extendedApi.useUpdateContentMutation,
    useDeleteContentMutation: extendedApi.useDeleteContentMutation,
    useRestoreContentVersionMutation: extendedApi.useRestoreContentVersionMutation,
  };
}
