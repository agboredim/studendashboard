import spin from "@/assets/img/spinner.png";

function Spinner() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur bg-opacity-50 z-50">
      <img src={spin} alt="Loading spinner" className="animate-spin w-60" />
    </div>
  );
}

export default Spinner;
