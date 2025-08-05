const Title = ({ text1, text2 }) => {
  return (
    <div className="title">
      <h2>
        {text1}
        <span>{text2}</span>
      </h2>
    </div>
  );
};

export default Title;
