export const InputWrapper = ({ label, children, id }) => (
  <div className="form-group mb-4">
    <label htmlFor={id} className="text-light">
      {label}
    </label>
    {children}
  </div>
)

export const StyledInput = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  ...rest
}) => (
  <input
    id={id}
    name={name}
    type={type}
    className="form-control"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    {...rest}
  />
)
