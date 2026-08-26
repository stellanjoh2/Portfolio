const factories = new Map();

export function register(type, factory) {
  factories.set(type, factory);
}

export function createEffect(spec, layer, api) {
  const factory = factories.get(spec.type);
  if (!factory) {
    console.warn(`[textfx] unknown effect "${spec.type}" — skip (register it later)`);
    return null;
  }
  return factory({ ...spec, layer }, api);
}

export function isRegistered(type) {
  return factories.has(type);
}
