// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

if (this.Worker) {
(function execution() {
var t1 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
};`;
var t2 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 2);
};`;
var t3 =
`onmessage = function(data) {
var x = new Int32Array(data.x_sab); id8_R_t3 = Atomics.load(x, 0); print("id8_R_t3: "+id8_R_t3);
var x = new Int16Array(data.x_sab); id9_R_t3 = Atomics.load(x, 1); print("id9_R_t3: "+id9_R_t3);
};`;
var data = {
x_sab : new SharedArrayBuffer(8),
}

var wt1 = new Worker(t1);
var wt2 = new Worker(t2);
var wt3 = new Worker(t3);
wt1.postMessage(data, [data.x_sab]);
wt2.postMessage(data, [data.x_sab]);
wt3.postMessage(data, [data.x_sab]);
})();
}

// Expected outputs //
//output// id8_R_t3: 33620481;id9_R_t3: 513
//output// id8_R_t3: 512;id9_R_t3: 1
//output// id8_R_t3: 512;id9_R_t3: 0
//output// id8_R_t3: 512;id9_R_t3: 2
//output// id8_R_t3: 513;id9_R_t3: 0
//output// id8_R_t3: 513;id9_R_t3: 1
//output// id8_R_t3: 513;id9_R_t3: 2
//output// id8_R_t3: 131584;id9_R_t3: 2
//output// id8_R_t3: 257;id9_R_t3: 2
//output// id8_R_t3: 257;id9_R_t3: 1
//output// id8_R_t3: 131584;id9_R_t3: 1
//output// id8_R_t3: 0;id9_R_t3: 2
//output// id8_R_t3: 0;id9_R_t3: 1
//output// id8_R_t3: 0;id9_R_t3: 0
//output// id8_R_t3: 131329;id9_R_t3: 2
//output// id8_R_t3: 131329;id9_R_t3: 1
//output// id8_R_t3: 66049;id9_R_t3: 514
//output// id8_R_t3: 0;id9_R_t3: 513
//output// id8_R_t3: 131585;id9_R_t3: 513
//output// id8_R_t3: 131329;id9_R_t3: 514
//output// id8_R_t3: 0;id9_R_t3: 514
//output// id8_R_t3: 131329;id9_R_t3: 513
//output// id8_R_t3: 131584;id9_R_t3: 513
//output// id8_R_t3: 65793;id9_R_t3: 1
//output// id8_R_t3: 131585;id9_R_t3: 2
//output// id8_R_t3: 1;id9_R_t3: 0
//output// id8_R_t3: 1;id9_R_t3: 1
//output// id8_R_t3: 1;id9_R_t3: 2
//output// id8_R_t3: 33686016;id9_R_t3: 513
//output// id8_R_t3: 33686016;id9_R_t3: 514
//output// id8_R_t3: 131584;id9_R_t3: 514
//output// id8_R_t3: 512;id9_R_t3: 513
//output// id8_R_t3: 131585;id9_R_t3: 1
//output// id8_R_t3: 66049;id9_R_t3: 513
//output// id8_R_t3: 65793;id9_R_t3: 2
//output// id8_R_t3: 513;id9_R_t3: 514
//output// id8_R_t3: 33620225;id9_R_t3: 513
//output// id8_R_t3: 33620225;id9_R_t3: 514
//output// id8_R_t3: 513;id9_R_t3: 513
//output// id8_R_t3: 257;id9_R_t3: 513
//output// id8_R_t3: 131585;id9_R_t3: 514
//output// id8_R_t3: 257;id9_R_t3: 0
//output// id8_R_t3: 257;id9_R_t3: 514
//output// id8_R_t3: 66049;id9_R_t3: 2
//output// id8_R_t3: 66049;id9_R_t3: 1
//output// id8_R_t3: 33620481;id9_R_t3: 514
//output// id8_R_t3: 33685761;id9_R_t3: 513
//output// id8_R_t3: 512;id9_R_t3: 514
//output// id8_R_t3: 33685761;id9_R_t3: 514
//output// id8_R_t3: 33686017;id9_R_t3: 514
//output// id8_R_t3: 65793;id9_R_t3: 514
//output// id8_R_t3: 1;id9_R_t3: 514
//output// id8_R_t3: 1;id9_R_t3: 513
//output// id8_R_t3: 65793;id9_R_t3: 513
//output// id8_R_t3: 33686017;id9_R_t3: 513
