import Title from "./Title";
import ProductItem from "./ProductItem";
import ToastSSRMessage from "@/utils/ToastSSRMessage";

const LatestCollections = ({ latestProducts, latestProductsError }) => {
  return (
    <section className="latest-collection">
      {latestProductsError && (
        <ToastSSRMessage message={latestProductsError} type="error" />
      )}
      <div className="latest-collection__container">
        <div className="wrap-latest-collection__content">
          <Title text1="Наші " text2="Новинки" />
          <p className="sub-title">
            Ознайомтеся з нашими новими колекціями та оберіть свій стиль на
            кожен день.
          </p>
          <div className="product__cards">
            {latestProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                images={item.images}
                price={item.price}
                name={item.name}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestCollections;
