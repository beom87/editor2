import Animation from './Animation';
import Insert from './Insert';
import Toolbar from './Toolbar';
import View from './View';

function App() {
    return (
        <div className='h-screen w-screen p-2'>
            <header>
                <Toolbar />
            </header>
            <main className='flex gap-x-2'>
                {/* <Insert /> */}
                <View />
                <div className='flex-1'>
                    <Animation />
                </div>
            </main>
        </div>
    );
}

export default App;
