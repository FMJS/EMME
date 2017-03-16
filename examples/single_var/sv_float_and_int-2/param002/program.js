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
for(i = 0; i <= 3; i++){
var x = new Int8Array(data.x_sab); x[3] = 35.0+i;
var x = new Int32Array(data.x_sab); id3_R_t1 = x[0]; print("id3_R_t1_"+i+": "+id3_R_t1);
}
};`;
var t2 =
`onmessage = function(data) {
var x = new Float32Array(data.x_sab); id4_R_t2 = x[0]; print("id4_R_t2: "+id4_R_t2.toFixed(4));
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
