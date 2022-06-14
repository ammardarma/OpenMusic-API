const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');

class MusicsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({name, year}){
        const id = nanoid(16);
        const query = {
            text : 'INSERT INTO albums VALUES($1, $2, $3) Returning id',
            values: [id, name, year],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums where id = $1',
            values : [id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        return result.rows[0];
    }

    async editAlbumById(id, {name, year}){
        const query = {
            text: 'UPDATE albums set name = $1, year = $2 where id = $3 returning id', 
            values: [name, year, id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(id){
        const query = {
            text: 'DELETE from albums where id = $1 returning id', 
            values : [id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }

    async addSong({title, year, performer, genre, duration, albumId}){
        const id = nanoid(16);

        const query = {
            text: 'INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7) Returning id',
            values: [id, title, year, performer, genre, duration, albumId],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }


    async getSongs() {
        const result = await this._pool.query('SELECT id, title, performer FROM songs');
        return result.rows;
    }

    async getSongById(id){
        const query = {
            text: 'SELECT * from songs where id = $1', 
            values : [id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return result.rows[0];
    }

    async editSongById(id, {title, year, performer, genre, duration, albumId}){
        const query = {
            text: 'UPDATE songs set title = $1, year = $2, performer = $3, genre = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, albumId, id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }
    }

    async deleteSongById(id){
        const query = {
            text: 'DELETE from songs where id = $1 returning id', 
            values: [id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = MusicsService;