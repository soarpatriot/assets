import assert from 'assert'
import * as f from '../../helpers/f'

const arrM = [
  'model/01.dds',
  'model/01.jpg',
  'model/01.png'
]

const arr = [ [ [ '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/__MACOSX/._male02.mtl' ],
  [ '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/__MACOSX/._male02.obj' ] ],
  [ '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02.mtl' ],
  [ '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02.obj' ],
  [ '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02_bin.bin' ],
  [ '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02_bin.js' ] ]
const cutted = [
  'male02.mtl',
  'male02.obj',
  'male02_bin.bin',
  'male02_bin.js'
]
const arrFlat = [ '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/__MACOSX/._male02.mtl',
  '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/__MACOSX/._male02.obj',
  '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02.mtl',
  '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02.obj',
  '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02_bin.bin',
  '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02_bin.js'
]
const arr2 = [
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/__MACOSX/model/._.DS_Store",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/__MACOSX/model/._01.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/__MACOSX/model/._02.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/__MACOSX/model/._03.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/.DS_Store",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/01.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/02.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/03.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/male02.obj",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/male02_dds.mtl"
]
const arr3 = [
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/male02.obj",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/male02_dds.mtl"
]


describe('f', function() {
  describe('#readdirPromisify()', function() {
    it('should return files ', async () => {
      const files = await f.readdirPromisify('/Users/liuhaibao/source/assets/test')
      assert.deepEqual(files, ['specs','unit']);
    });
  });

  describe('#statPromisify()', function() {
    it('should return files ', async () => {
      const stat = await f.statPromisify('/Users/liuhaibao/source/assets/test')
      // console.log("stat: " + stat.isDirectory())
      assert.equal(true, stat.isDirectory());
    });
  });

  describe('#listDir()', function() {
    it('should return files ', async () => {
      const files = await f.listDir('/Users/liuhaibao/source/assets/test/unit/f')
      const arr = files.reduce((a,b) => { return a.concat(b) })
      assert.deepEqual(arr, ['/Users/liuhaibao/source/assets/test/unit/f/a.txt',
                       '/Users/liuhaibao/source/assets/test/unit/f/b.txt']);
    });
  });

  describe('#removePrefix()', function() {
    it('should replace prefix', async () => {
      const relative = f.removePrefix('/Users/liuhaibao/source/assets/test.js', '/Users/liuhaibao/source')
      assert.equal(relative, 'assets/test.js');
    });
  });

  describe('#regenRelative()', function() {
    it('#regenRelative', async () => {
      const relative = f.regenRelative(arr3, '/Users/liuhaibao/source')
      // console.log('relative ff: ' + relative)
      assert.deepEqual(relative, ['assets/static/upload/20177/1499179623917/model/male02.obj',
                      'assets/static/upload/20177/1499179623917/model/male02_dds.mtl']);
    });

  });


  describe('#flat()', function() {
    it('should flat prefix', async () => {
      const r = f.flat(arr)
      assert.deepEqual(r, arrFlat);
    });
  });
  describe('#strArr()', function() {
    it('should flat refine', async () => {
      const r = f.struArr(arr, '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253')
      assert.deepEqual(r,cutted );
    });
  });

  describe('#mArray()', function() {
    it('should return a element of png jpeg jpg', async () => {
      const m = f.mArray(arrM)
      assert.equal(m,'model/01.dds');
    });
  });

  describe('#mArray()', function() {
    it('should return a element of png jpeg jpg', async () => {
      const parent = 'http://aa.com'
      const mname = 'model/01.dds'
      const m = f.matPath(parent, mname)
      assert.equal(m,'http://aa.com/model');
    });
  });


});
