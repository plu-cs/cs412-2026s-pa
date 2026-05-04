/**
 * A custom map that is useful for tracking edges in a mesh.
 */
export class EdgeMap {

    // This map is private, and should
    // Key = string containing the point indices in ascending order
    // Value = the associated data 
    #map : Map<string, number>;

    /**
     * Constructs an empty EdgeMap.
     */
    constructor() {
        this.#map = new Map();
    }

    /**
     * Returns whether or not the given edge is already in the map.
     * 
     * @param a the index of one point on the edge
     * @param b the index of the other point on the edge
     * @returns true if this EdgeMap already contains this edge, false otherwise.     
     */
    has( a : number, b : number ) : boolean {
        return this.#map.has( this.makeKey(a,b) );
    }

    /**
     * Makes a key for the map using the indices of the points on the edge.
     * 
     * @param a the index of one point on the edge
     * @param b the index of the other point on the edge
     * @returns a string based on a and b, suitable for a key in the map
     */
    makeKey( a : number, b : number ) : string {
        if( b > a ) {
            return `${a}:${b}`;
        } else {
            return `${b}:${a}`;
        }
    }

    /**
     * Sets an entry in this EdgeMap associated with the edge corresponding
     * to a and b.  
     * 
     * @param a the index of one point on the edge
     * @param b the index of the other point on the edge
     * @param value the value to set
     */
    set( a : number, b : number, value : number ) : void {
        this.#map.set(this.makeKey(a,b), value);
    }

    /**
     * Gets the value associated with an edge.
     * 
     * @param a the index of one point on the edge
     * @param b the index of the other point on the edge
     * @returns the value corresponding to the edge, or undefined if the edge is not in the map.
     */
    get( a : number, b : number ) : (number | undefined) {
        return this.#map.get( this.makeKey(a, b) );
    }
}