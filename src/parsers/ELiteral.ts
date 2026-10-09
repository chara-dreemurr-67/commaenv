import EnvDataType from "../types/EnvDataType.js";

export default class ELiteral<T extends number | string> extends EnvDataType<T> {
    private readonly AcceptableValues: Set<T>;
    private readonly Type: "string" | "number";

    public constructor(AcceptableValue: T);
    public constructor(...AcceptableValues: T[]);
    public constructor(...AcceptableValues: T[]) {
        super();

        if(AcceptableValues.length === 0)
            throw new SyntaxError("Must includes at least 1 value.");

        const FirstElement: T = AcceptableValues[0];
        const Type = typeof FirstElement;
        if(
            Type !== "number" && Type !== "string"
            || !AcceptableValues.every(V => typeof V === Type)
        ) throw new TypeError("Invalid or inconsistent literal values, all values must either be of type string or number.");
        this.AcceptableValues = new Set(AcceptableValues);
        this.Type = Type;
    }

    public Parse(Name: string): T {
        const Env: string | undefined = process.env[Name]?.trim();

        if(!Env) {
            if(this.DefaultValue == undefined)
                throw new TypeError(`Variable ${Name} doesn't exists.`);
            return this.DefaultValue;
        }

        if(this.Type === "string") {
            if(!this.AcceptableValues.has(Env as T))
                throw new TypeError(`Value "${Env}" isn't an acceptable literal value.`);
            return Env as T;
        }

        const Parsed: number = Number(Env);
        if(Number.isNaN(Parsed))
            throw new TypeError(`Variable ${Name} isn't a number.`);
        if(!this.AcceptableValues.has(Parsed as T))
            throw new TypeError(`Value "${Env}" isn't an acceptable literal value.`);
        return Parsed as T;
    }

    public Default(Value: T): this {
        if(!this.AcceptableValues.has(Value))
            throw new TypeError(`Value ${Value} isn't an acceptable literal value.`);
        this.DefaultValue = Value;
        return this;
    }
}