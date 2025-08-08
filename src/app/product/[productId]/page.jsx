// Самі сторінки треба робити переважно ssr,
// а от компоненти вже можуть піддаватися гідрації та використовувати реакт через "use client"

// "use client";
// import { useParams } from "next/navigation"; // парцює коли є "use client";

import ClientProduct from "./ClientProduct"; // компонент, який буде гідратуватися на клієнті

export default async function Product({ params }) {
  //   const params = useParams();
  const { productId } = await params;

  // console.log("===================");
  // console.dir(params, { depth: null, colors: true });

  return (
    <>
      <h1>Product page</h1>
      <p>{productId}</p>
      <hr />
      <ClientProduct />
    </>
  );
}
