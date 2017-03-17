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
var x = new Int8Array(data.x_sab); x[0] = 0;
var x = new Int8Array(data.x_sab); x[1] = 0;
var x = new Int8Array(data.x_sab); x[0] = 2;
var x = new Int8Array(data.x_sab); x[1] = 2;
};`;
var t2 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; print("id6_R_t2: "+id6_R_t2);
if(id6_R_t2 >= 1) {
var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; print("id7_R_t2: "+id7_R_t2);
} else {
var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; print("id8_R_t2: "+id8_R_t2);
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
//output// id6_R_t2: 0;id8_R_t2: 0
//output// id6_R_t2: 0;id8_R_t2: 2
//output// id6_R_t2: 2;id7_R_t2: 2
