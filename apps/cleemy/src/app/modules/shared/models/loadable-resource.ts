export class LoadableResource<T> {
  loading = false;
  error: any | null = null;
  // @ts-ignore
  resource: T = null;
  // @ts-ignore
  total?: number = null;
}
