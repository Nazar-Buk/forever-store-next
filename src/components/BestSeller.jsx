import Title from "./Title";
import ProductItem from "./ProductItem";
import ToastSSRMessage from "@/utils/ToastSSRMessage";

const BestSeller = ({ bestsellers, bestsellersError }) => {
  return (
    <section className="best-sellers">
      {bestsellersError && (
        <ToastSSRMessage message={bestsellersError} type="error" />
      )}
      <div className="best-sellers__container">
        <div className="wrap-best-sellers__content">
          <Title text1="Хіти " text2="Продажів" />
          <p className="sub-title">
            Топ-продажі, що завоювали серця покупців. Ознайомтеся з
            найпопулярнішими товарами сезону, які поєднують стиль, комфорт та
            якість, і оберіть свій фаворит серед них.
          </p>
          <div className="product__cards">
            {bestsellers.map((item) => (
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

export default BestSeller;
