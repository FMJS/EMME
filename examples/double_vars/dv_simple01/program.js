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
var x = new Int16Array(data.x_sab); Atomics.store(x, 0, 1);
var y = new Int16Array(data.y_sab); Atomics.store(y, 0, 1);
};`;
var t2 =
`onmessage = function(data) {
var x = new Int16Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); print("id5_R_t2: "+id5_R_t2);
var y = new Int16Array(data.y_sab); id6_R_t2 = Atomics.load(y, 0); print("id6_R_t2: "+id6_R_t2);
};`;
var data = {
x_sab : new SharedArrayBuffer(8),
y_sab : new SharedArrayBuffer(8),
}


var wt1 = new Worker(t1);
var wt2 = new Worker(t2);
wt1.postMessage(data, [data.x_sab, data.y_sab]);
wt2.postMessage(data, [data.x_sab, data.y_sab]);
})();
}

// Expected outputs //
//output// id5_R_t2: 0;id6_R_t2: 1
//output// id5_R_t2: 0;id6_R_t2: 0
//output// id5_R_t2: 1;id6_R_t2: 0
//output// id5_R_t2: 1;id6_R_t2: 1