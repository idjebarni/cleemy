export class LoadableResource<T> {
  loading = false;
  error: any | null = null;
  resource: T | null = null;
  total?: number | null = null;
}
