"use client";

const Newsletter = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <section className="newsletter">
      <div className="newsletter__container newsletter-body">
        <h3 className="newsletter__title">
          Підпишись зараз & отримай 20% знижки
        </h3>
        <p className="newsletter__sub-title">
          Підпишіться на нашу розсилку, щоб першими дізнаватися про новинки,
          ексклюзивні пропозиції та спеціальні акції.
        </p>
        <form onSubmit={onSubmitHandler} className="input-subscribe">
          <input
            type="email"
            className="email"
            placeholder="Введіть емейл"
            required
          />
          <button type="submit" className="subscribe-btn">
            Підписатися
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
