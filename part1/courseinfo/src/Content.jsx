import Part from './Part';

const Content = (props) => {
    const {parts} = props;
    console.log(parts);
    return (
        <div>
     {parts.map(part => 
          <Part key={part.id} name={part.name} exercise={part.exercises}/>
        )}
        </div>
    )
}

export default Content