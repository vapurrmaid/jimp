import {
  JimpType,
  JimpPlugin,
} from './plugins';

// This is required as providing type arrays gives a union of all the generic
// types in the array rather than an intersection
export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * The values to be extracted from a WellFormedPlugin to put onto the Jimp instance
 * Left loose as "any" in order to enable the GetPluginValue to work properly
 */
export type WellFormedValues<T extends any> = 
  T['class'] &
  T['constants'];

// Util type for the functions that deal with `@jimp/custom`
// Must accept any or no props thanks to typing of the `plugins` intersected function
export type FunctionRet<T> = Array<(...props: any[] | never) => T>;

/**
 * This conditional cannot be flipped. TS assumes that Q is `WellFormed` even
 * it does not have the `class` or `constant` props. As a result, it will end
 * up `undefined`. Because we're always extending `IllformedPlugin` on the
 * plugins, this should work fine
 */
export type GetPluginVal<Q> = Q extends Required<{class: any}> | Required<{constant: any}>
  ? WellFormedValues<Q>
  : Q;

type GetPluginFuncArrValues<PluginFuncArr> =
  // Given an array of types infer `Q` (Q should be the type value)
  PluginFuncArr extends Array<() => infer Q>
  ? // Get the plugin value, may be ill-formed or well-formed
    GetPluginVal<Q>
  : // This should never be reached
    undefined;

/**
 * A helper type to get the values to be intersected with `Jimp` to give
 * the proper typing given an array of functions for plugins and types
 */
export type GetIntersectionFromPlugins<
  PluginFuncArr extends FunctionRet<JimpPlugin | JimpType>
> = UnionToIntersection<GetPluginFuncArrValues<PluginFuncArr>>;

/**
 * While this was added to TS 3.5, in order to support down to TS 2.8, we need
 * to export this and use it in sub-packges that utilize it
 */
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
