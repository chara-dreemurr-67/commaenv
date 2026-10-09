export default abstract class EnvDataType<T> {
    protected DefaultValue?: T;
    public abstract Parse(Name: string): T;
    /**
     * Set the default return value of the variable.
     */
    public abstract Default(Value: T): this;
}