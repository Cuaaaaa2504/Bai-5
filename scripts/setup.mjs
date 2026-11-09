import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
const requested=process.argv.find(arg=>/^--sdk=\d+$/.test(arg));
const sdk=requested?requested.split('=')[1]:null;
function run(args){const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',args,{stdio:'inherit',shell:process.platform==='win32'});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);}
// Install Expo first, then use its own compatibility map instead of guessed native versions.
run(['install',...(sdk?['expo@^'+sdk+'.0.0']:[])]);
const versions=JSON.parse(readFileSync('node_modules/expo/bundledNativeModules.json','utf8'));
const pkg=JSON.parse(readFileSync('package.json','utf8'));
for(const name of ['react','react-native','expo-video','expo-constants','@react-native-async-storage/async-storage','react-native-safe-area-context']){if(!versions[name])throw new Error('Expo compatibility map is missing '+name);pkg.dependencies[name]=versions[name];}
writeFileSync('package.json',JSON.stringify(pkg,null,2)+'\n');
run(['install']);
run(['exec','--','expo','install','--check']);
console.log('Setup completed. Keep package.json and package-lock.json together. Run npm run tunnel.');
