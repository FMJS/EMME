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
var x = new Float32Array(data.x_sab); x[0] = 0.000000;
var x = new Float32Array(data.x_sab); x[1] = 0.000000;
};`;
var t2 =
`onmessage = function(data) {
var x = new Float32Array(data.x_sab); x[1] = 1.000000;
var x = new Float32Array(data.x_sab); x[2] = 1.000000;
};`;
var t3 =
`onmessage = function(data) {
var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; print("id6_R_t3: "+id6_R_t3.toFixed(6));
var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; print("id7_R_t3: "+id7_R_t3.toFixed(6));
};`;
var data = {
x_sab : new SharedArrayBuffer(16),
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
//output// id6_R_t3: 0.000032;id7_R_t3: 0.000000
//output// id6_R_t3: 0.007813;id7_R_t3: 0.000000
//output// id6_R_t3: 0.000000;id7_R_t3: 0.000000
