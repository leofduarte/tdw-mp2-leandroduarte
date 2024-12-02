import {useNavigate} from "react-router-dom";
import error404Img from '../assets/error404.png';

const Error404 = () => {

  const Navigate = useNavigate()
  return (
    <>
    <main className="grid place-items-center my-auto px-6 lg:px-8 bg-white h-screen">
      <div className="text-center flex flex-col items-center justify-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">Sorry, i think you are in the wrong location!</p>
        <img className="w-3/5 mt-2 max-w-screen-lg" src={error404Img} alt="Error 404"/>
        <div className="mt-3 flex items-center justify-center gap-x-6">
          <button
              onClick={() => Navigate("/")}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </button>
        </div>
      </div>
    </main>
    </>
  );
};

export default Error404;