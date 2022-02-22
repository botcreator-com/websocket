

/**
 * @param {number } time The time in milliseconds
 * 
 * @returns An array of number
 */
const parseMilliseconds = function (time) {

        return {
            "days": Math.trunc(time / 86400000),
            "hours": Math.trunc(time / 3600000) % 24,
            "minutes": Math.trunc(time / 60000) % 60,
            "seconds": Math.trunc(time / 1000) % 60,
            "milliseconds": Math.trunc(time) % 1000,
            "microseconds": Math.trunc(time * 1000) % 1000,
            "nanoseconds": Math.trunc(time * 1e6) % 1000
        };

    },

    pluralize = (word, count) => count === 1 ? word : `${word}s`;

const SECOND_ROUNDING_EPSILON = 0.0000001;

module.exports = (milliseconds, options = {}) => {

    if (!Number.isFinite(milliseconds)) {

        throw new TypeError("Expected a finite number");

    }

    if (options.colonNotation) {

        options.compact = false;
        options.formatSubMilliseconds = false;
        options.separateMilliseconds = false;
        options.verbose = false;

    }

    if (options.compact) {

        options.secondsDecimalDigits = 0;
        options.millisecondsDecimalDigits = 0;

    }

    const result = [],

	 floorDecimals = (value, decimalDigits) => {

            const flooredInterimValue = Math.floor(value * 10 ** decimalDigits + SECOND_ROUNDING_EPSILON),
		 flooredValue = Math.round(flooredInterimValue) / 10 ** decimalDigits;
            return flooredValue.toFixed(decimalDigits);

        },

	 add = (value, long, short, valueString) => {

            if ((result.length === 0 || !options.colonNotation) && value === 0 && !(options.colonNotation && short === "m")) {

                return;

            }

            valueString = (valueString || value || "0").toString();
            let prefix,
		 suffix;
            if (options.colonNotation) {

                prefix = result.length > 0
                    ? ":"
                    : "";
                suffix = "";
                const wholeDigits = valueString.includes(".")
                        ? valueString.split(".")[0].length
                        : valueString.length,
			 minLength = result.length > 0
                        ? 2
                        : 1;
                valueString = "0".repeat(Math.max(
                    0,
                    minLength - wholeDigits
                )) + valueString;

            } else {

                prefix = "";
                suffix = options.verbose
                    ? ` ${pluralize(
                        long,
                        value
                    )}`
                    : short;

            }

            result.push(prefix + valueString + suffix);

        },

	 parsed = parseMilliseconds(milliseconds);

    add(
        Math.trunc(parsed.days / 365),
        "year",
        "y"
    );
    add(
        parsed.days % 365,
        "day",
        "d"
    );
    add(
        parsed.hours,
        "hour",
        "h"
    );
    add(
        parsed.minutes,
        "minute",
        "m"
    );

    if (
        options.separateMilliseconds ||
		options.formatSubMilliseconds ||
		!options.colonNotation && milliseconds < 1000
    ) {

        add(
            parsed.seconds,
            "second",
            "s"
        );
        if (options.formatSubMilliseconds) {

            add(
                parsed.milliseconds,
                "millisecond",
                "ms"
            );
            add(
                parsed.microseconds,
                "microsecond",
                "µs"
            );
            add(
                parsed.nanoseconds,
                "nanosecond",
                "ns"
            );

        } else {

            const millisecondsAndBelow =
				parsed.milliseconds +
				parsed.microseconds / 1000 +
				parsed.nanoseconds / 1e6,

                millisecondsDecimalDigits =
				typeof options.millisecondsDecimalDigits === "number"
				    ? options.millisecondsDecimalDigits
				    : 0,

			 roundedMiliseconds = millisecondsAndBelow >= 1
                    ? Math.round(millisecondsAndBelow)
                    : Math.ceil(millisecondsAndBelow),

			 millisecondsString = millisecondsDecimalDigits
                    ? millisecondsAndBelow.toFixed(millisecondsDecimalDigits)
                    : roundedMiliseconds;

            add(
                Number.parseFloat(
                    millisecondsString,
                    10
                ),
                "millisecond",
                "ms",
                millisecondsString
            );

        }

    } else {

        const seconds = milliseconds / 1000 % 60,
		 secondsDecimalDigits =
			typeof options.secondsDecimalDigits === "number"
			    ? options.secondsDecimalDigits
			    : 1,
		 secondsFixed = floorDecimals(
                seconds,
                secondsDecimalDigits
            ),
		 secondsString = options.keepDecimalsOnWholeSeconds
                ? secondsFixed
                : secondsFixed.replace(
                    /\.0+$/,
                    ""
                );
        add(
            Number.parseFloat(
                secondsString,
                10
            ),
            "second",
            "s",
            secondsString
        );

    }

    if (result.length === 0) {

        return `0${options.verbose
            ? " milliseconds"
            : "ms"}`;

    }

    if (options.compact) {

        return result[0];

    }

    if (typeof options.unitCount === "number") {

        const separator = options.colonNotation
            ? ""
            : " ";
        return result.slice(
            0,
            Math.max(
                options.unitCount,
                1
            )
        ).join(separator);

    }

    return options.colonNotation
        ? result.join("")
        : result.join(" ");

};
