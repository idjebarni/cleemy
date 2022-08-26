export class LoadableResource<T> {
  loading = false;
  error: any | null = null;
  resource: any = null;
  total?: any = null;
}
