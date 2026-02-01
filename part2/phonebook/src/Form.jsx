const Form = (props) => {
  return (
    <div>
      <form>
        <div>
          name: <input value={props.valueName} onChange={props.onChangeName} />
        </div>
         <div>
          number: <input value={props.valueNumber} onChange={props.onChangeNumber} />
        </div>
        <div>
          <button type="submit" onClick={props.submitButton}>add</button>
        </div>
      </form>
    </div>
  )
}

export default Form