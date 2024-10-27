import React,{ Component } from 'react';
import './App.css';
import CustomModal from './components/Modal';
import axios from 'axios';
import { Button } from 'reactstrap';


class App extends Component {
    constructor(props){
        super(props);
        this.state={
            modal:false,
            viewCompleted:false,
            activeItem:{
                title:"",
                description:"",
                Completed:false
            },
            todoList:[]
            
        };
    }

    componentDidMount(){
        this.refreshList();
    }

    refreshList = () => {
       axios
        .get("http://localhost:8000/api/tasks/")
        .then( res => this.State({todoList: res.data}))
        .catch(err => console.log(err))
            
    };


    toggle = () =>{
        this.setState({modal : !this.state.modal});
    };

    handleSubmit= item => {
        this.toggle();
        if (item.id) {
            axios
            .put("http://localhost:8000/api/tasks/${item.id}/" , item)
            .then( res => this.refreshList())
        }
        axios
            .post("http://localhost:8000/api/tasks/" , item)
            .then( res => this.refreshList())
    };

    
    handleDelete= item => {
        axios
            .delete("http://localhost:8000/api/tasks/${item.id}/")
            .then( res => this.refreshList())
    }

    createItem=() => {
        const item= {title:"" , modal:this.state.modal};
        this.setState({ activeItem:item, modal:!this.state.modal})
    }

    editAnyItem = item => {
        return this.setState({activeItem:item, modal:!this.state.modal})
    }


    displaycompleted = status =>{
        if (status){
            return this.setState({ viewCompleted :true});
        }
        return this.setState({ viewCompleted :false});
    }


    renderTabList = () =>{
        return(
            <div className='my-5 tab-list'>
                <span 
                    onClick={() => this.displaycompleted(true)}
                    className={this.state.viewCompleted ? "active" :""}
                >
                    completed
                </span>
                <span
                    onClick={() => this.displaycompleted(false)}
                    className={this.state.viewCompleted ? "" :"active"}
                >
                    Incompleted
                </span>
            </div>
        )
    };

    renderItems= () =>{
        const { viewCompleted } = this.state;
        const newItems= this.state.todoList.filter(
            item => item.completed === viewCompleted
        );
        console.log(newItems);

        return newItems.map(item =>(
            <li key= {item.id} className='list-group list-group-item d-flex justify-content-between align-items-center'>

                {/* <span className={'todo-title mr-2 ' + (this.state.viewCompleted ? "completed-todo" : "")}
                    title={item.title}> */}
                <span>
                    {item.title}
                </span>

                <span>
                    <button className='btn btn-info mr-2'>Edit</button>
                    <button className='btn btn-danger mr-2'>Delete</button>
                </span>
                
            </li>
        ))
    };
    
    
    render() {
        return(
            <main className='content p-3 mb-2 bg-info'>
                <h1 className='text-white text-uppercase text-center my-4'>Task Manager</h1>
                <div className='row'>
                    <div className='col-md-6 col-sma-10 max-auto p-8'>
                        <div className='card-p3'>
                            <div>
                            <Button className='btn btn-warning' onClick={this.createItem}> Add Task</Button>
                            </div>
                            {this.renderTabList()}
                            <ul className='list-group list-group-flush'>
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>

                <footer className='my-3 mb-2 bg-info text-white text-center' >copyright 2024 &copy;
                </footer>
                {this.state.modal ? (
                    <CustomModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                 ) : null}


            </main>
        )
    }


}


export default App;
