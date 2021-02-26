import App from './App.svelte';
import AppNatl from './AppNatl.svelte';
const appNatl = new AppNatl({
	target: document.getElementById('interactive-national-sample')
});
const app = new App({
	target: document.getElementById('interactive')
});

export default { app, appNatl };
