import LoadingComponent from "./LoadingComponent";

const ButtonComponent = ({
  children,
  className,
  onClick,
  disabled,
  type,
  isLoading,
}: any) => {
  // console.log(props);
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {isLoading ? (
        <LoadingComponent className="w-5 h-5 border-2 border-white border-t-blue-500" />
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonComponent;
