const ProductItem = (props) => {
  const { id, image, name, price, addToCart } = props.product;
  return (
    <div key={id} className="col-md-4 mt-3 mb-3">
      <div className="card h-100 product-card">
        <img className="card-img-top p-2" src={image} alt={name} />
        <div className="card-body">
          <h4 className="card-title">{name}</h4>
          <p className="card-text">₹ {price}</p>
          <button
             onClick={() => addToCart({ id, image, name, price })}
            className="btn btn-primary"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
