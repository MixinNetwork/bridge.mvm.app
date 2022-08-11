import { type Stores, type StoresValues, type Loadable, asyncDerived } from '@square/svelte-store';

export const asyncDerivedStores = <S extends Stores, T, F = T>(
	stores: S,
	mappingLoadableFunction: (values: StoresValues<S>) => Loadable<T>[] | undefined,
	mappingLoadFunction?: (values: T[]) => F[]
) => {
	const tempStores = asyncDerived(stores, async (value) => mappingLoadableFunction(value));
	const value = asyncDerived(tempStores, async ($tempStores) => {
		if (!$tempStores) return;
		const value = await Promise.all($tempStores.map((loadable) => loadable.load()));
		if (!mappingLoadFunction) return value as F[];
		return mappingLoadFunction(value);
	});

	return value;
};
