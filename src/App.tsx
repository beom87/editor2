import Animation from './Animation';
import Toolbar from './Toolbar';
import View from './View';

function App() {
    return (
        <div className='h-screen w-screen'>
            <header>
                <Toolbar />
            </header>
            <main className='flex'>
                <View />
                <div className='flex-1'>
                    <Animation />
                </div>
            </main>
        </div>
    );
}

export default App;
