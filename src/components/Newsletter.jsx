"use client";

const Newsletter = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <section className="newsletter">
      <div className="newsletter__container newsletter-body">
        <h3 className="newsletter__title">Subscribe now & get 20% off</h3>
        <p className="newsletter__sub-title">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
        <form onSubmit={onSubmitHandler} className="input-subscribe">
          <input
            type="email"
            className="email"
            placeholder="Enter email"
            required
          />
          <button type="submit" className="subscribe-btn">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
