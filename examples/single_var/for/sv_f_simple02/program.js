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
var x = new Int8Array(data.x_sab); x[0] = 1;
for(i = 0; i <= 2; i++){
var x = new Int8Array(data.x_sab); Atomics.store(x, i+1, i+1);
}
};`;
var t2 =
`onmessage = function(data) {
for(i = 0; i <= 1; i++){
var x = new Int16Array(data.x_sab); id4_R_t2 = Atomics.load(x, i); print("id4_R_t2_"+i+": "+id4_R_t2);
}
};`;
var data = {
x_sab : new SharedArrayBuffer(8),
}

var wt1 = new Worker(t1);
var wt2 = new Worker(t2);
wt1.postMessage(data, [data.x_sab]);
wt2.postMessage(data, [data.x_sab]);
})();
}

// Expected outputs //
//output// id4_R_t2_0: 1;id4_R_t2_1: 770
//output// id4_R_t2_0: 0;id4_R_t2_1: 770
//output// id4_R_t2_0: 1;id4_R_t2_1: 0
//output// id4_R_t2_0: 0;id4_R_t2_1: 0
//output// id4_R_t2_0: 1;id4_R_t2_1: 2
//output// id4_R_t2_0: 0;id4_R_t2_1: 2
//output// id4_R_t2_0: 257;id4_R_t2_1: 770
//output// id4_R_t2_0: 257;id4_R_t2_1: 0
//output// id4_R_t2_0: 257;id4_R_t2_1: 2