# kleisli-requestors   
Kleisli-type requestors compatible with [curried-parseq](https://github.com/jlrwi/curried-parseq).   
## Format   
A kleisli requestor takes a simple value and returns success in this format:   
```   
{   
    fst: <log value>,   
    snd: <work result>   
}   
```   
This format is compatible with pair_type in [static-types-basic](https://github.com/jlrwi/static-types-basic).   
## Functions   
### k_sequence   
Returns a curried-parseq sequence requestor ready to accept an array of kleisli-type requestors and return a pair with concatenated log values. The `log_type` parameter must be a [curried-static-land](https://github.com/jlrwi/curried-static-land) monoid. The optional `options` object may specify a `time_limit` property.   
Usage:   
```   
const kleisli_sequence = k_sequence(log_type);   
kleisli_sequence(options)(callback)(initial_value);   
```   
