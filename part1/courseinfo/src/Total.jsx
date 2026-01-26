const Total = (props) => {
       const {parts} = props;
 const total = parts.reduce(
  (sum, value) => sum + value.exercises,
  0,
);

console.log(total);
    return (
        <div>
        <p>Number of exercises {total}</p>
        </div>
    )
}

export default Total