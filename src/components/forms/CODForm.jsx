"use client";

const CODForm = (props) => {
  const { handleSubmit, onSubmit, register, errors } = props;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="payment__body"
    >
      <div className="payment__delivery-info">
        <div className="delivery-info__form-fields">
          <div className="wrap-short-fields">
            <div className="wrap-input">
              <input
                type="text"
                id="first-name"
                className="delivery-info__field"
                placeholder="First name"
                {...register("firstName")}
              />
              <p className="error">{errors.firstName?.message}</p>
            </div>

            <div className="wrap-input">
              <input
                type="text"
                id="last-name"
                className="delivery-info__field"
                placeholder="Last name"
                {...register("lastName")}
              />
              <p className="error">{errors.lastName?.message}</p>
            </div>
          </div>
          <div className="wrap-input">
            <input
              type="email"
              id="email"
              className="delivery-info__field long-field"
              placeholder="Email address"
              {...register("email")}
            />
            <p className="error">{errors.email?.message}</p>
          </div>

          <div className="wrap-input">
            <input
              type="text"
              id="street"
              className="delivery-info__field long-field"
              placeholder="Street"
              {...register("street")}
            />
            <p className="error">{errors.street?.message}</p>
          </div>

          <div className="wrap-short-fields">
            <div className="wrap-input">
              <input
                type="text"
                id="city"
                className="delivery-info__field"
                placeholder="City"
                {...register("city")}
              />
              <p className="error">{errors.city?.message}</p>
            </div>

            <div className="wrap-input">
              <input
                type="text"
                id="state"
                className="delivery-info__field"
                placeholder="State"
                {...register("state")}
              />
              <p className="error">{errors.state?.message}</p>
            </div>
          </div>
          <div className="wrap-short-fields">
            <div className="wrap-input">
              <input
                type="number"
                id="zip-code"
                className="delivery-info__field"
                placeholder="Zip code"
                {...register("zip_code")}
              />
              <p className="error">{errors.zip_code?.message}</p>
            </div>

            <div className="wrap-input">
              <input
                type="text"
                id="country"
                className="delivery-info__field"
                placeholder="Country"
                {...register("country")}
              />
              <p className="error">{errors.country?.message}</p>
            </div>
          </div>
          <div className="wrap-input">
            <input
              type="text"
              id="phone"
              className="delivery-info__field long-field"
              placeholder="Phone"
              {...register("phone")}
            />
            <p className="error">{errors.phone?.message}</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CODForm;
