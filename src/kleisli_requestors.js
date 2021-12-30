/*jslint
    fudge
*/

//MD # kleisli-requestors/p
//MD Kleisli-type requestors compatible with
//MD [curried-parseq](https://github.com/jlrwi/curried-parseq)./p
//MD ## Format/p
//MD A kleisli requestor takes a simple value and returns success in this
//MD format:/p
//MD ```/p
//MD {/p
//MD     fst: <log value>,/p
//MD     snd: <work result>/p
//MD }/p
//MD ```/p
//MD This format is compatible with pair_type in
//MD [static-types-basic](https://github.com/jlrwi/static-types-basic)./p

//MD ## Functions/p

import {
    identity,
    pipeN
} from "@jlrwi/combinators";
import {
    array_map
} from "@jlrwi/esfunctions";
import {
    record_requestor,
    unary_requestor
} from "@jlrwi/requestors";
import parseq from "@jlrwi/curried-parseq";
import requestor_type from "@jlrwi/requestor-type";

const req_type = requestor_type();

//MD ### k_sequence/p
//MD Returns a curried-parseq sequence requestor ready to accept an array of
//MD kleisli-type requestors and return a pair with concatenated log values.
//MD The `log_type` parameter must be a
//MD [curried-static-land](https://github.com/jlrwi/curried-static-land)
//MD monoid.
//MD The optional `options` object may specify a `time_limit` property./p
//MD Usage:/p
//MD ```/p
//MD const kleisli_sequence = k_sequence(log_type);/p
//MD kleisli_sequence(options)(callback)(initial_value);/p
//MD ```/p
const k_sequence = function (log_type) {
    return function (options) {

// Reformat initial input to be a pair
        const map_initial_value_to_pair = function (initial_value) {
            return {
                fst: log_type.empty(),
                snd: initial_value
            };
        };

// Take result in form {fst, {fst, snd}} and concat fst's to return {fst, snd}
        const map_result_to_pair = function ({fst, snd}) {
            return {
                fst: log_type.concat(fst)(snd.fst),
                snd: snd.snd
            };
        };

// Take a Klesli requestor and put into a pair with log passthrough
        const map_to_record = function (requestor) {
            return req_type.map(
                map_result_to_pair
            )(
                record_requestor()({
                    fst: unary_requestor(identity),
                    snd: requestor
                })
            );
        };

// Takes array of Kleisli-type requestors
        return pipeN(
// Map them to be record requestors
            array_map(map_to_record),
// Create a sequence requestor using supplied options
            parseq.sequence(options),
// Reformat the input value to be a pair with an empty log value
            req_type.contramap(map_initial_value_to_pair)
        );
    };
};

export {
    k_sequence
};