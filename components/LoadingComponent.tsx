const LoadingComponent = ({ className="h-20 w-20 block border-4 border-sky-400 border-t-white" }: any) => {
  // className : w h border-[width] border-[color]-[opacity] border-t-[color]-[opacity]
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className={`block rounded-full animate-spin + ${className}`}></div>
    </div>
  );
};

export default LoadingComponent;
