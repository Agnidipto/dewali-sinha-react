function ErrorFunction(err) {
  console.log(err.message);
  if (
    err.response &&
    err.response.data &&
    typeof err.response.data !== "object"
  )
    return { open: true, message: err.response.data };
  else return { open: true, message: err.message };
}

export default ErrorFunction;
