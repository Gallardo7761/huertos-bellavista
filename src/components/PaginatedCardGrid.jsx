import LoadingIcon from './LoadingIcon';

const PaginatedCardGrid = ({
  items = [],
  renderCard,
  creatingItem = null,
  renderCreatingCard = null,
  loaderRef,
  loading = false
}) => {
  return (
    <div className="cards-grid">
      {creatingItem && renderCreatingCard && renderCreatingCard()}

      {items.map((item, i) => renderCard(item, i))}

      <div ref={loaderRef} className="loading-trigger">
        {loading && <LoadingIcon />}
      </div>
    </div>
  );
};

export default PaginatedCardGrid;
